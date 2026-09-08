from pathlib import Path
from typing import Any

import cv2
import numpy as np


class TomatoQualityEstimator:
    """
    Prototype visual quality estimator for tomatoes.

    IMPORTANT
    ---------
    This is a deterministic visual heuristic, NOT a trained
    ripeness or defect classification model.

    It estimates visible quality using:
        - ripeness / maturity
        - color balance
        - color uniformity
        - visible dark / defect-like regions
        - surface condition
        - image sharpness

    The estimator is intended for the AgriSathi MVP while
    dedicated trained ripeness and defect models are being
    developed.

    It must NOT be interpreted as:
        - AGMARK certification
        - food safety certification
        - internal defect detection
        - guaranteed quality
        - guaranteed market grade
    """

    def __init__(self):
        pass

    def analyze_crop(
        self,
        image_path: str | Path,
        bbox: dict[str, int],
    ) -> dict[str, Any]:
        """
        Analyze a tomato crop using its bounding box.
        """

        image_path = Path(image_path)

        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        height, width = image.shape[:2]

        x1 = max(0, int(bbox["x1"]))
        y1 = max(0, int(bbox["y1"]))
        x2 = min(width, int(bbox["x2"]))
        y2 = min(height, int(bbox["y2"]))

        if x2 <= x1 or y2 <= y1:
            raise ValueError(
                "Invalid tomato bounding box."
            )

        crop = image[y1:y2, x1:x2]

        if crop.size == 0:
            raise ValueError(
                "Empty tomato crop."
            )

        return self._analyze_image(crop)

    def _analyze_image(
        self,
        crop: np.ndarray,
    ) -> dict[str, Any]:
        """
        Calculate the visible quality indicators.
        """

        if crop.shape[0] < 10 or crop.shape[1] < 10:
            return {
                "qualityScore": 0.0,
                "grade": "Recovery",
                "metrics": {},
                "assessmentType": "visual_heuristic",
            }

        # ---------------------------------------------------------
        # 1. Basic color conversion
        # ---------------------------------------------------------

        hsv = cv2.cvtColor(
            crop,
            cv2.COLOR_BGR2HSV,
        )

        rgb = cv2.cvtColor(
            crop,
            cv2.COLOR_BGR2RGB,
        )

        h, s, v = cv2.split(hsv)

        # ---------------------------------------------------------
        # 2. Create a central region mask
        #
        # Bounding boxes can contain some background.
        # The central ellipse reduces the influence of corners.
        # ---------------------------------------------------------

        mask = np.zeros(
            crop.shape[:2],
            dtype=np.uint8,
        )

        center_x = crop.shape[1] // 2
        center_y = crop.shape[0] // 2

        radius_x = max(
            1,
            int(crop.shape[1] * 0.42),
        )

        radius_y = max(
            1,
            int(crop.shape[0] * 0.42),
        )

        cv2.ellipse(
            mask,
            (center_x, center_y),
            (radius_x, radius_y),
            0,
            0,
            360,
            255,
            -1,
        )

        valid_pixels = mask > 0

        if np.count_nonzero(valid_pixels) < 20:
            valid_pixels = np.ones(
                crop.shape[:2],
                dtype=bool,
            )

        hsv_pixels = hsv[valid_pixels]

        h_pixels = hsv_pixels[:, 0].astype(
            np.float32
        )

        s_pixels = hsv_pixels[:, 1].astype(
            np.float32
        )

        v_pixels = hsv_pixels[:, 2].astype(
            np.float32
        )

        # ---------------------------------------------------------
        # 3. Color masks
        # ---------------------------------------------------------

        red_mask_1 = cv2.inRange(
            hsv,
            np.array([0, 60, 45]),
            np.array([12, 255, 255]),
        )

        red_mask_2 = cv2.inRange(
            hsv,
            np.array([170, 60, 45]),
            np.array([180, 255, 255]),
        )

        red_mask = cv2.bitwise_or(
            red_mask_1,
            red_mask_2,
        )

        green_mask = cv2.inRange(
            hsv,
            np.array([35, 35, 35]),
            np.array([90, 255, 255]),
        )

        yellow_mask = cv2.inRange(
            hsv,
            np.array([12, 45, 45]),
            np.array([40, 255, 255]),
        )

        # Apply central mask.
        red_pixels = np.count_nonzero(
            (red_mask > 0) & valid_pixels
        )

        green_pixels = np.count_nonzero(
            (green_mask > 0) & valid_pixels
        )

        yellow_pixels = np.count_nonzero(
            (yellow_mask > 0) & valid_pixels
        )

        total_pixels = max(
            1,
            np.count_nonzero(valid_pixels),
        )

        red_ratio = red_pixels / total_pixels
        green_ratio = green_pixels / total_pixels
        yellow_ratio = yellow_pixels / total_pixels

        # ---------------------------------------------------------
        # 4. Ripeness score
        #
        # Red contributes positively.
        # Yellow contributes moderately.
        # Green reduces maturity.
        #
        # This prevents "red" alone from automatically meaning A.
        # ---------------------------------------------------------

        maturity_score = (
            red_ratio * 100.0
            + yellow_ratio * 55.0
            - green_ratio * 70.0
        )

        maturity_score = max(
            0.0,
            min(100.0, maturity_score),
        )

        # ---------------------------------------------------------
        # 5. Color balance
        #
        # Penalize tomatoes where a large portion is still green,
        # yellow, or visually inconsistent.
        # ---------------------------------------------------------

        mature_color_ratio = (
            red_ratio
            + yellow_ratio * 0.45
        )

        green_penalty = min(
            45.0,
            green_ratio * 100.0,
        )

        color_balance_score = (
            mature_color_ratio * 100.0
            - green_penalty
        )

        color_balance_score = max(
            0.0,
            min(100.0, color_balance_score),
        )

        # ---------------------------------------------------------
        # 6. Color uniformity
        #
        # Large variation in saturation/value often indicates
        # inconsistent surface appearance, shadows, or patches.
        # ---------------------------------------------------------

        saturation_std = float(
            np.std(s_pixels)
        )

        value_std = float(
            np.std(v_pixels)
        )

        # Normalize the variation.
        #
        # Lower variation -> higher uniformity.
        saturation_penalty = min(
            55.0,
            saturation_std * 0.75,
        )

        value_penalty = min(
            45.0,
            value_std * 0.65,
        )

        uniformity_score = (
            100.0
            - saturation_penalty
            - value_penalty
        )

        uniformity_score = max(
            0.0,
            min(100.0, uniformity_score),
        )

        # ---------------------------------------------------------
        # 7. Visible dark region detection
        #
        # Dark areas can indicate:
        #   - bruising
        #   - damaged tissue
        #   - rot-like visual regions
        #   - strong shadow
        #
        # Therefore this is explicitly described as
        # "defect-like", not confirmed defects.
        # ---------------------------------------------------------

        dark_mask = cv2.inRange(
            hsv,
            np.array([0, 20, 0]),
            np.array([180, 255, 55]),
        )

        dark_region_ratio = (
            np.count_nonzero(
                (dark_mask > 0) & valid_pixels
            )
            / total_pixels
        )

        # ---------------------------------------------------------
        # 8. Brown / dark chromatic region detection
        #
        # These regions can be useful as visible defect indicators,
        # but are not treated as definitive defects.
        # ---------------------------------------------------------

        brown_mask = cv2.inRange(
            hsv,
            np.array([5, 45, 20]),
            np.array([30, 255, 125]),
        )

        brown_region_ratio = (
            np.count_nonzero(
                (brown_mask > 0) & valid_pixels
            )
            / total_pixels
        )

        # ---------------------------------------------------------
        # 9. Detect concentrated defect-like regions
        #
        # Instead of penalizing every dark pixel equally, identify
        # connected dark/brown regions.
        # ---------------------------------------------------------

        defect_like_mask = cv2.bitwise_or(
            dark_mask,
            brown_mask,
        )

        # Keep only central tomato region.
        defect_like_mask = cv2.bitwise_and(
            defect_like_mask,
            defect_like_mask,
            mask=mask,
        )

        kernel = np.ones(
            (3, 3),
            dtype=np.uint8,
        )

        defect_like_mask = cv2.morphologyEx(
            defect_like_mask,
            cv2.MORPH_OPEN,
            kernel,
        )

        defect_like_mask = cv2.morphologyEx(
            defect_like_mask,
            cv2.MORPH_CLOSE,
            kernel,
        )

        num_labels, labels, stats, _ = (
            cv2.connectedComponentsWithStats(
                defect_like_mask,
                connectivity=8,
            )
        )

        significant_defect_area = 0

        min_region_area = max(
            4,
            int(total_pixels * 0.003),
        )

        significant_regions = 0

        for label in range(
            1,
            num_labels,
        ):
            area = int(
                stats[label, cv2.CC_STAT_AREA]
            )

            if area >= min_region_area:
                significant_defect_area += area
                significant_regions += 1

        concentrated_defect_ratio = (
            significant_defect_area
            / total_pixels
        )

        # ---------------------------------------------------------
        # 10. Visible condition score
        # ---------------------------------------------------------

        dark_penalty = min(
            35.0,
            dark_region_ratio * 180.0,
        )

        brown_penalty = min(
            25.0,
            brown_region_ratio * 140.0,
        )

        concentrated_penalty = min(
            25.0,
            concentrated_defect_ratio * 220.0,
        )

        visible_condition_score = (
            100.0
            - dark_penalty
            - brown_penalty
            - concentrated_penalty
        )

        visible_condition_score = max(
            0.0,
            min(100.0, visible_condition_score),
        )

        # ---------------------------------------------------------
        # 11. Image sharpness
        #
        # Very blurry crops should not receive a strong quality
        # score simply because their colors look acceptable.
        # ---------------------------------------------------------

        gray = cv2.cvtColor(
            crop,
            cv2.COLOR_BGR2GRAY,
        )

        laplacian_variance = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F,
            ).var()
        )

        if laplacian_variance >= 180:
            sharpness_score = 100.0
        elif laplacian_variance >= 80:
            sharpness_score = 80.0
        elif laplacian_variance >= 35:
            sharpness_score = 60.0
        elif laplacian_variance >= 15:
            sharpness_score = 40.0
        else:
            sharpness_score = 20.0

        # ---------------------------------------------------------
        # 12. Brightness quality
        #
        # Extremely dark or overexposed crops are less reliable.
        # ---------------------------------------------------------

        mean_brightness = float(
            np.mean(v_pixels)
        )

        if 75 <= mean_brightness <= 220:
            brightness_score = 100.0
        elif 55 <= mean_brightness < 75:
            brightness_score = 75.0
        elif 220 < mean_brightness <= 240:
            brightness_score = 75.0
        elif 35 <= mean_brightness < 55:
            brightness_score = 50.0
        elif 240 < mean_brightness <= 250:
            brightness_score = 50.0
        else:
            brightness_score = 30.0

        # ---------------------------------------------------------
        # 13. Overall image reliability
        # ---------------------------------------------------------

        image_quality_score = (
            sharpness_score * 0.60
            + brightness_score * 0.40
        )

        # ---------------------------------------------------------
        # 14. Final visible quality score
        #
        # IMPORTANT:
        #
        # Ripeness is NOT the majority of the score.
        #
        # A tomato must also have acceptable visible condition,
        # color balance and consistency.
        # ---------------------------------------------------------

        quality_score = (
            maturity_score * 0.30
            + color_balance_score * 0.15
            + uniformity_score * 0.15
            + visible_condition_score * 0.25
            + image_quality_score * 0.15
        )

        # ---------------------------------------------------------
        # 15. Reliability penalty
        #
        # If the crop is visually unreliable, reduce the score.
        # ---------------------------------------------------------

        if image_quality_score < 45:
            quality_score *= 0.82

        elif image_quality_score < 60:
            quality_score *= 0.92

        quality_score = max(
            0.0,
            min(100.0, quality_score),
        )

        # ---------------------------------------------------------
        # 16. Conservative grade thresholds
        #
        # Grade A requires a genuinely strong visible score.
        # ---------------------------------------------------------

        if (
            quality_score >= 78
            and maturity_score >= 65
            and visible_condition_score >= 70
            and image_quality_score >= 50
        ):
            grade = "A"

        elif (
            quality_score >= 52
            and visible_condition_score >= 45
        ):
            grade = "B"

        else:
            grade = "Recovery"

        # ---------------------------------------------------------
        # 17. Return result
        # ---------------------------------------------------------

        return {
            "qualityScore": round(
                quality_score,
                2,
            ),

            "grade": grade,

            "metrics": {
                "ripenessScore": round(
                    maturity_score,
                    2,
                ),

                "redRatio": round(
                    red_ratio,
                    4,
                ),

                "greenRatio": round(
                    green_ratio,
                    4,
                ),

                "yellowRatio": round(
                    yellow_ratio,
                    4,
                ),

                "colorBalance": round(
                    color_balance_score,
                    2,
                ),

                "colorUniformity": round(
                    uniformity_score,
                    2,
                ),

                "visibleCondition": round(
                    visible_condition_score,
                    2,
                ),

                "darkRegionRatio": round(
                    dark_region_ratio,
                    4,
                ),

                "brownRegionRatio": round(
                    brown_region_ratio,
                    4,
                ),

                "concentratedDefectRatio": round(
                    concentrated_defect_ratio,
                    4,
                ),

                "visibleDefectRegions": (
                    significant_regions
                ),

                "imageSharpness": round(
                    laplacian_variance,
                    2,
                ),

                "imageQuality": round(
                    image_quality_score,
                    2,
                ),

                "meanBrightness": round(
                    mean_brightness,
                    2,
                ),
            },

            "assessmentType": (
                "visual_heuristic"
            ),

            "disclaimer": (
                "Visible-image assessment only. "
                "Internal defects may not be visible."
            ),
        }