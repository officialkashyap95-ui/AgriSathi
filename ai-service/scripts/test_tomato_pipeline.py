from pathlib import Path

from app.services.detection.tomato_detector import (
    TomatoDetector,
)

from app.services.preprocessing.tomato_crops import (
    TomatoCropper,
)


IMAGE_PATH = Path(
    "dataset/processed/tomato-yolo/images/test/tomato303.png"
)

OUTPUT_DIR = Path(
    "runs/crops/tomato303"
)


def main():
    detector = TomatoDetector(
        confidence=0.40
    )

    detections = detector.predict(
        IMAGE_PATH
    )

    print(
        f"Detected tomatoes: "
        f"{len(detections)}"
    )

    for detection in detections:
        print(detection)

    cropper = TomatoCropper(
        padding_ratio=0.08
    )

    crops = cropper.crop_detections(
        image_path=IMAGE_PATH,
        detections=detections,
        output_dir=OUTPUT_DIR,
    )

    print(
        f"Created crops: {len(crops)}"
    )

    print(
        f"Crops saved to: "
        f"{OUTPUT_DIR}"
    )


if __name__ == "__main__":
    main()