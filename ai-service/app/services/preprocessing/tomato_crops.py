from pathlib import Path
from typing import Any

from PIL import Image


class TomatoCropper:
    def __init__(
        self,
        padding_ratio: float = 0.08,
        min_crop_size: int = 20,
    ):
        self.padding_ratio = padding_ratio
        self.min_crop_size = min_crop_size

    def crop_detections(
        self,
        image_path: str | Path,
        detections: list[dict[str, Any]],
        output_dir: str | Path,
    ) -> list[dict[str, Any]]:
        image_path = Path(image_path)
        output_dir = Path(output_dir)

        output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        image = Image.open(image_path).convert("RGB")

        image_width, image_height = image.size

        crops: list[dict[str, Any]] = []

        for detection in detections:
            bbox = detection["bbox"]

            x1 = bbox["x1"]
            y1 = bbox["y1"]
            x2 = bbox["x2"]
            y2 = bbox["y2"]

            box_width = x2 - x1
            box_height = y2 - y1

            if (
                box_width < self.min_crop_size
                or box_height < self.min_crop_size
            ):
                continue

            padding_x = int(
                box_width * self.padding_ratio
            )

            padding_y = int(
                box_height * self.padding_ratio
            )

            crop_x1 = max(
                0,
                x1 - padding_x,
            )

            crop_y1 = max(
                0,
                y1 - padding_y,
            )

            crop_x2 = min(
                image_width,
                x2 + padding_x,
            )

            crop_y2 = min(
                image_height,
                y2 + padding_y,
            )

            crop = image.crop(
                (
                    crop_x1,
                    crop_y1,
                    crop_x2,
                    crop_y2,
                )
            )

            detection_id = detection[
                "detection_id"
            ]

            confidence = detection[
                "confidence"
            ]

            filename = (
                f"tomato_{detection_id:03d}"
                f"_conf_{confidence:.2f}.jpg"
            )

            crop_path = output_dir / filename

            crop.save(
                crop_path,
                quality=95,
            )

            crops.append(
                {
                    "detection_id": detection_id,
                    "confidence": confidence,
                    "crop_path": str(
                        crop_path
                    ),
                    "bbox": bbox,
                }
            )

        return crops