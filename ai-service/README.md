# AgriSathi Dataset

The datasets used for model development are intentionally not stored
inside this Git repository because of their size and licensing terms.

## Tomato Detection Dataset

Source:
Kaggle Tomato Detection Dataset

Purpose:
Tomato object detection

Expected local structure:

dataset/
├── raw/
│   └── tomato-detection/
└── processed/
    └── tomato-yolo/

After downloading the dataset, run:

python scripts/voc_to_yolo.py

Then prepare the train/validation/test split using the dataset
preparation script.

## Important

Dataset licenses and attribution must be reviewed before redistribution.