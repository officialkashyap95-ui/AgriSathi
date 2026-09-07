from pathlib import Path
import random
import shutil


# --------------------------------------------------
# Configuration
# --------------------------------------------------

SEED = 42

TRAIN_RATIO = 0.80
VAL_RATIO = 0.10
TEST_RATIO = 0.10

DATASET_ROOT = Path("dataset/raw/tomato-detection")
PROCESSED_ROOT = Path("dataset/processed/tomato-yolo")

IMAGES_SOURCE = DATASET_ROOT / "images"
LABELS_SOURCE = PROCESSED_ROOT / "labels"


# --------------------------------------------------
# Validate ratios
# --------------------------------------------------

assert abs(
    TRAIN_RATIO + VAL_RATIO + TEST_RATIO - 1.0
) < 1e-6


# --------------------------------------------------
# Create directories
# --------------------------------------------------

for split in ["train", "val", "test"]:
    (PROCESSED_ROOT / "images" / split).mkdir(
        parents=True,
        exist_ok=True,
    )

    (PROCESSED_ROOT / "labels" / split).mkdir(
        parents=True,
        exist_ok=True,
    )


# --------------------------------------------------
# Collect images
# --------------------------------------------------

image_extensions = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

images = sorted(
    [
        path
        for path in IMAGES_SOURCE.iterdir()
        if path.suffix.lower() in image_extensions
    ]
)


print(f"Images found: {len(images)}")


# --------------------------------------------------
# Shuffle deterministically
# --------------------------------------------------

random.seed(SEED)
random.shuffle(images)


# --------------------------------------------------
# Calculate split sizes
# --------------------------------------------------

total = len(images)

train_count = int(total * TRAIN_RATIO)
val_count = int(total * VAL_RATIO)

train_images = images[:train_count]

val_images = images[
    train_count:
    train_count + val_count
]

test_images = images[
    train_count + val_count:
]


splits = {
    "train": train_images,
    "val": val_images,
    "test": test_images,
}


# --------------------------------------------------
# Copy images + labels
# --------------------------------------------------

for split, split_images in splits.items():

    print(
        f"\nCopying {split}: "
        f"{len(split_images)} images"
    )

    for image_path in split_images:

        label_path = (
            LABELS_SOURCE
            / f"{image_path.stem}.txt"
        )

        if not label_path.exists():
            raise FileNotFoundError(
                f"Missing label for "
                f"{image_path.name}"
            )

        destination_image = (
            PROCESSED_ROOT
            / "images"
            / split
            / image_path.name
        )

        destination_label = (
            PROCESSED_ROOT
            / "labels"
            / split
            / label_path.name
        )

        shutil.copy2(
            image_path,
            destination_image,
        )

        shutil.copy2(
            label_path,
            destination_label,
        )


# --------------------------------------------------
# Final summary
# --------------------------------------------------

print("\nDataset split completed.")
print("--------------------------------")
print(
    f"Train: {len(train_images)}"
)
print(
    f"Validation: {len(val_images)}"
)
print(
    f"Test: {len(test_images)}"
)
print(
    f"Total: {sum(len(v) for v in splits.values())}"
)