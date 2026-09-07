from pathlib import Path
import xml.etree.ElementTree as ET


# --------------------------------------------------
# Paths
# --------------------------------------------------

DATASET_ROOT = Path("dataset/raw/tomato-detection")

IMAGES_DIR = DATASET_ROOT / "images"
ANNOTATIONS_DIR = DATASET_ROOT / "annotations"

OUTPUT_ROOT = Path("dataset/processed/tomato-yolo")

LABELS_DIR = OUTPUT_ROOT / "labels"


# --------------------------------------------------
# Create output directory
# --------------------------------------------------

LABELS_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# VOC -> YOLO conversion
# --------------------------------------------------

def convert_box_to_yolo(
    xmin,
    ymin,
    xmax,
    ymax,
    image_width,
    image_height,
):
    center_x = (xmin + xmax) / 2
    center_y = (ymin + ymax) / 2

    box_width = xmax - xmin
    box_height = ymax - ymin

    center_x /= image_width
    center_y /= image_height
    box_width /= image_width
    box_height /= image_height

    return (
        center_x,
        center_y,
        box_width,
        box_height,
    )


def convert_annotation(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    size = root.find("size")

    image_width = int(size.find("width").text)
    image_height = int(size.find("height").text)

    yolo_annotations = []

    for obj in root.findall("object"):
        class_name = obj.find("name").text.strip()

        # AgriSathi detector currently has one class:
        # 0 = tomato
        if class_name != "tomato":
            continue

        bbox = obj.find("bndbox")

        xmin = float(bbox.find("xmin").text)
        ymin = float(bbox.find("ymin").text)
        xmax = float(bbox.find("xmax").text)
        ymax = float(bbox.find("ymax").text)

        # Clamp coordinates to image boundaries
        xmin = max(0, min(xmin, image_width))
        ymin = max(0, min(ymin, image_height))
        xmax = max(0, min(xmax, image_width))
        ymax = max(0, min(ymax, image_height))

        # Ignore invalid boxes
        if xmax <= xmin or ymax <= ymin:
            continue

        (
            center_x,
            center_y,
            box_width,
            box_height,
        ) = convert_box_to_yolo(
            xmin,
            ymin,
            xmax,
            ymax,
            image_width,
            image_height,
        )

        yolo_annotations.append(
            f"0 {center_x:.6f} {center_y:.6f} "
            f"{box_width:.6f} {box_height:.6f}"
        )

    return yolo_annotations


# --------------------------------------------------
# Process all annotations
# --------------------------------------------------

xml_files = sorted(ANNOTATIONS_DIR.glob("*.xml"))

converted = 0
empty = 0
failed = 0

for xml_path in xml_files:
    try:
        annotations = convert_annotation(xml_path)

        output_file = LABELS_DIR / f"{xml_path.stem}.txt"

        output_file.write_text(
            "\n".join(annotations) + "\n"
            if annotations
            else ""
        )

        if annotations:
            converted += 1
        else:
            empty += 1

    except Exception as error:
        failed += 1

        print(
            f"Failed: {xml_path.name} -> {error}"
        )


# --------------------------------------------------
# Summary
# --------------------------------------------------

print()
print("VOC → YOLO conversion completed.")
print("--------------------------------")
print(f"XML files found : {len(xml_files)}")
print(f"Converted       : {converted}")
print(f"Empty labels    : {empty}")
print(f"Failed          : {failed}")
print(f"Output          : {LABELS_DIR}")