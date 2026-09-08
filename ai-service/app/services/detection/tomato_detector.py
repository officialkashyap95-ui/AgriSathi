from pathlib import Path
from typing import Any

from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "tomato"
    / "trained"
    / "tomato_detector_v1_best.pt"
)


class TomatoDetector:
    def __init__(
    self,
    model_path: str | Path = MODEL_PATH,
    confidence: float = 0.40,
    image_size: int = 640,
    iou_threshold: float = 0.50,
    min_box_width: int = 20,
    min_box_height: int = 20,
    min_box_area_ratio: float = 0.0003,
):
        self.model_path = Path(model_path)
        self.confidence = confidence
        self.image_size = image_size
        self.iou_threshold = iou_threshold
        self.min_box_width = min_box_width
        self.min_box_height = min_box_height
        self.min_box_area_ratio = min_box_area_ratio

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Tomato detection model not found: "
                f"{self.model_path}"
            )

        self.model = YOLO(str(self.model_path))

    def predict(
        self,
        image_path: str | Path,
    ) -> list[dict[str, Any]]:
        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        results = self.model.predict(
            source=str(image_path),
            imgsz=self.image_size,
            conf=self.confidence,
            iou=self.iou_threshold,
            verbose=False,
        )

        raw_detections: list[dict[str, Any]] = []

        for result in results:
            if result.boxes is None:
                continue

            boxes = result.boxes

            for index in range(len(boxes)):
                xyxy = boxes.xyxy[index].tolist()

                confidence = float(
                    boxes.conf[index].item()
                )

                class_id = int(
                    boxes.cls[index].item()
                )

                raw_detections.append(
                    {
                        "class_id": class_id,
                        "class_name": "tomato",
                        "confidence": confidence,
                        "bbox": {
                            "x1": int(xyxy[0]),
                            "y1": int(xyxy[1]),
                            "x2": int(xyxy[2]),
                            "y2": int(xyxy[3]),
                        },
                    }
                )

        # ---------------------------------------------
        # Remove remaining duplicate/overlapping boxes
        # ---------------------------------------------

        filtered_detections = self._filter_overlapping(
            raw_detections
        )

        filtered_detections = self._filter_crop_quality(
            filtered_detections,
            image_path,
        )

        # ---------------------------------------------
        # Assign stable detection IDs after filtering
        # ---------------------------------------------

        detections: list[dict[str, Any]] = []

        for index, detection in enumerate(
            filtered_detections,
            start=1,
        ):
            detections.append(
                {
                    "detection_id": index,
                    **detection,
                }
            )

        return detections

    def _filter_overlapping(
        self,
        detections: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """
        Keep the highest-confidence detection when
        two tomato boxes overlap heavily.

        This is an additional safety filter on top
        of YOLO's built-in NMS.
        """

        if len(detections) <= 1:
            return detections

        # Highest-confidence detections first.
        sorted_detections = sorted(
            detections,
            key=lambda detection: detection["confidence"],
            reverse=True,
        )

        kept: list[dict[str, Any]] = []

        for detection in sorted_detections:

            should_keep = True

            for existing in kept:

                overlap = self._calculate_iou(
                    detection["bbox"],
                    existing["bbox"],
                )

                if overlap >= self.iou_threshold:
                    should_keep = False
                    break

            if should_keep:
                kept.append(detection)

        return kept

    @staticmethod
    def _calculate_iou(
        box_a: dict[str, int],
        box_b: dict[str, int],
    ) -> float:
        """
        Calculate Intersection over Union (IoU)
        between two bounding boxes.
        """

        ax1 = box_a["x1"]
        ay1 = box_a["y1"]
        ax2 = box_a["x2"]
        ay2 = box_a["y2"]

        bx1 = box_b["x1"]
        by1 = box_b["y1"]
        bx2 = box_b["x2"]
        by2 = box_b["y2"]

        intersection_x1 = max(ax1, bx1)
        intersection_y1 = max(ay1, by1)

        intersection_x2 = min(ax2, bx2)
        intersection_y2 = min(ay2, by2)

        intersection_width = max(
            0,
            intersection_x2 - intersection_x1,
        )

        intersection_height = max(
            0,
            intersection_y2 - intersection_y1,
        )

        intersection_area = (
            intersection_width
            * intersection_height
        )

        if intersection_area == 0:
            return 0.0

        area_a = (
            max(0, ax2 - ax1)
            * max(0, ay2 - ay1)
        )

        area_b = (
            max(0, bx2 - bx1)
            * max(0, by2 - by1)
        )

        union_area = (
            area_a
            + area_b
            - intersection_area
        )

        if union_area <= 0:
            return 0.0

        return intersection_area / union_area