from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.detection.tomato_detector import (
    TomatoDetector,
)
from app.services.quality.tomato_quality import (
    TomatoQualityEstimator,
)


router = APIRouter(
    prefix="/detection",
    tags=["Detection"],
)


detector = TomatoDetector(
    confidence=0.40,
    image_size=640,
)

quality_estimator = TomatoQualityEstimator()


@router.post("/tomato")
async def detect_tomatoes(
    image: UploadFile = File(...),
):
    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPEG, PNG and WebP "
                "images are supported."
            ),
        )

    contents = await image.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    suffix = Path(
        image.filename or "image.jpg"
    ).suffix or ".jpg"

    temporary_file = None

    try:
        temporary_file = NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        )

        temporary_file.write(contents)
        temporary_file.close()

        # ---------------------------------------------
        # STEP 1: Detect tomatoes using YOLO
        # ---------------------------------------------

        detections = detector.predict(
            temporary_file.name
        )

        # ---------------------------------------------
        # STEP 2: Analyze every detected tomato
        # ---------------------------------------------

        grade_counts = {
            "A": 0,
            "B": 0,
            "Recovery": 0,
        }

        analyzed_detections = []

        for detection in detections:
            try:
                quality_result = (
                    quality_estimator.analyze_crop(
                        temporary_file.name,
                        detection["bbox"],
                    )
                )

                grade = quality_result["grade"]

                if grade in grade_counts:
                    grade_counts[grade] += 1

                analyzed_detections.append(
                    {
                        **detection,
                        "quality": quality_result,
                    }
                )

            except Exception as error:
                print(
                    "Quality analysis error:",
                    error,
                )

                analyzed_detections.append(
                    {
                        **detection,
                        "quality": {
                            "qualityScore": None,
                            "grade": "Unknown",
                            "assessmentType": (
                                "visual_heuristic_failed"
                            ),
                        },
                    }
                )

        # ---------------------------------------------
        # STEP 3: Calculate distribution
        # ---------------------------------------------

        total_analyzed = sum(
            grade_counts.values()
        )

        if total_analyzed > 0:
            grade_distribution = {
                "gradeA": round(
                    (
                        grade_counts["A"]
                        / total_analyzed
                    )
                    * 100,
                    2,
                ),
                "gradeB": round(
                    (
                        grade_counts["B"]
                        / total_analyzed
                    )
                    * 100,
                    2,
                ),
                "recovery": round(
                    (
                        grade_counts["Recovery"]
                        / total_analyzed
                    )
                    * 100,
                    2,
                ),
            }

        else:
            grade_distribution = {
                "gradeA": 0,
                "gradeB": 0,
                "recovery": 0,
            }

        return {
            "success": True,
            "filename": image.filename,

            # Detection results
            "detections": analyzed_detections,
            "count": len(analyzed_detections),

            # Quality results
            "quality": {
                "analyzedTomatoes": total_analyzed,
                "gradeCounts": {
                    "gradeA": grade_counts["A"],
                    "gradeB": grade_counts["B"],
                    "recovery": grade_counts["Recovery"],
                },
                "distribution": grade_distribution,
                "assessmentType": (
                    "visual_heuristic"
                ),
            },
        }

    except Exception as error:
        print(
            "Tomato detection error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Tomato detection failed.",
        )

    finally:
        if temporary_file is not None:
            try:
                Path(
                    temporary_file.name
                ).unlink(
                    missing_ok=True
                )
            except Exception:
                pass