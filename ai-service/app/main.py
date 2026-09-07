from fastapi import FastAPI

app = FastAPI(
    title="AgriSathi AI Service",
    description="AI-powered post-harvest crop quality analysis service",
    version="1.0.0",
)


@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "AgriSathi AI Service is running",
    }