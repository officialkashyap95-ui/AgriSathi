from pathlib import Path
from typing import Any

import cv2
import numpy as np


class TomatoQualityEstimator:
    """
    Prototype visual quality estimator.

    This is NOT a trained ripeness/defect model.
    It estimates visible tomato quality from:
    - color
    - color uniformity
    - visible dark/defect-like regions
    - image quality

    The estimator is deterministic:
    the same tomato crop should produce the same result.
    """

    def __init__(self):
        pass

    def analyze_crop(
        self,
        image_path: str | Path,
        bbox: dict[str, int],
    ) -> dict[str, Any]:

        image_path = Path(image_path)

        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        height, width = image.shape[:2]

        x1 = max(0, bbox["x1"])
        y1 = max(0, bbox["y1"])
        x2 = min(width, bbox["x2"])
        y2 = min(height, bbox["y2"])

        if x2 <= x1 or y2 <= y1:
            raise ValueError("Invalid tomato bounding box.")

        crop = image[y1:y2, x1:x2]

        if crop.size == 0:
            raise ValueError("Empty tomato crop.")

        return self._analyze_image(crop)

    def _analyze_image(
        self,
        crop: np.ndarray,
    ) -> dict[str, Any]:

        # Convert BGR → HSV
        hsv = cv2.cvtColor(
            crop,
            cv2.COLOR_BGR2HSV,
        )

        # Convert BGR → RGB
        rgb = cv2.cvtColor(
            crop,
            cv2.COLOR_BGR2RGB,
        )

        h, s, v = cv2.split(hsv)

        # --------------------------------------------------
        # 1. COLOR ANALYSIS
        # --------------------------------------------------

        mean_r = float(np.mean(rgb[:, :, 0]))
        mean_g = float(np.mean(rgb[:, :, 1]))
        mean_b = float(np.mean(rgb[:, :, 2]))

        # Red dominance.
        red_dominance = (
            mean_r / (mean_g + mean_b + 1.0)
        )

        # --------------------------------------------------
        # 2. RIPENESS ESTIMATE
        # --------------------------------------------------

        # HSV red regions.
        red_mask_1 = cv2.inRange(
            hsv,
            np.array([0, 70, 50]),
            np.array([12, 255, 255]),
        )

        red_mask_2 = cv2.inRange(
            hsv,
            np.array([170, 70, 50]),
            np.array([180, 255, 255]),
        )

        red_mask = cv2.bitwise_or(
            red_mask_1,
            red_mask_2,
        )

        red_ratio = (
            np.count_nonzero(red_mask)
            / red_mask.size
        )

        # Green regions.
        green_mask = cv2.inRange(
            hsv,
            np.array([35, 40, 40]),
            np.array([90, 255, 255]),
        )

        green_ratio = (
            np.count_nonzero(green_mask)
            / green_mask.size
        )

        # Yellow/orange regions.
        yellow_mask = cv2.inRange(
            hsv,
            np.array([12, 50, 50]),
            np.array([40, 255, 255]),
        )

        yellow_ratio = (
            np.count_nonzero(yellow_mask)
            / yellow_mask.size
        )

        # --------------------------------------------------
        # 3. COLOR UNIFORMITY
        # --------------------------------------------------

        saturation_std = float(
            np.std(s.astype(np.float32))
        )

        value_std = float(
            np.std(v.astype(np.float32))
        )

        uniformity_score = 100.0 - min(
            100.0,
            (saturation_std + value_std) / 2.0,
        )

        uniformity_score = max(
            0.0,
            uniformity_score,
        )

        # --------------------------------------------------
        # 4. VISIBLE DARK / DEFECT-LIKE REGIONS
        # --------------------------------------------------

        dark_mask = cv2.inRange(
            hsv,
            np.array([0, 0, 0]),
            np.array([180, 255, 55]),
        )

        dark_ratio = (
            np.count_nonzero(dark_mask)
            / dark_mask.size
        )

        # Very dark regions can indicate:
        # bruising, decay-like regions, shadows, etc.
        #
        # Important:
        # This is only a visual heuristic.
        defect_penalty = min(
            40.0,
            dark_ratio * 100.0,
        )

        # --------------------------------------------------
        # 5. RIPENESS SCORE
        # --------------------------------------------------

        ripeness_score = (
            red_ratio * 100.0
            + yellow_ratio * 35.0
            - green_ratio * 45.0
        )

        ripeness_score = max(
            0.0,
            min(100.0, ripeness_score),
        )

        # --------------------------------------------------
        # 6. FINAL QUALITY SCORE
        # --------------------------------------------------

        quality_score = (
            ripeness_score * 0.50
            + uniformity_score * 0.25
            + (100.0 - defect_penalty) * 0.25
        )

        quality_score = max(
            0.0,
            min(100.0, quality_score),
        )

        # --------------------------------------------------
        # 7. QUALITY GRADE
        # --------------------------------------------------

        if quality_score >= 70:
            grade = "A"

        elif quality_score >= 45:
            grade = "B"

        else:
            grade = "Recovery"

        return {
            "qualityScore": round(
                quality_score,
                2,
            ),
            "grade": grade,
            "metrics": {
                "ripenessScore": round(
                    ripeness_score,
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
                "colorUniformity": round(
                    uniformity_score,
                    2,
                ),
                "darkRegionRatio": round(
                    dark_ratio,
                    4,
                ),
            },
            "assessmentType": "visual_heuristic",
        }