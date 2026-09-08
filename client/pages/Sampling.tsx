import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react"

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ImagePlus,
  Info,
  Leaf,
  MapPin,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import api from "../src/lib/api"

const MIN_IMAGES = 5
const MAX_IMAGES = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024

const API_BASE_URL = "http://localhost:5001"

interface HarvestLot {
  crop: string
  quantity: number
  harvestDate: string
  location: string
  lotName?: string
  condition?: string
  notes?: string
}

interface SampleImage {
  id: string
  file: File | null
  preview: string
  persisted: boolean
}

interface ApiSampleImage {
  _id: string
  lotId: string
  sampleNumber: number
  originalName: string
  fileName: string
  filePath: string
  mimeType: string
  size: number
  qualityStatus:
    | "pending"
    | "accepted"
    | "rejected"
  createdAt: string
  updatedAt: string
}

function Sampling() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const inputRef =
    useRef<HTMLInputElement | null>(null)

  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const cameraStreamRef =
    useRef<MediaStream | null>(null)

  const [lot, setLot] =
    useState<HarvestLot | null>(null)

  const [images, setImages] =
    useState<SampleImage[]>([])

  const [cameraOpen, setCameraOpen] =
    useState(false)

  const [cameraError, setCameraError] =
    useState("")

  const [isDragging, setIsDragging] =
    useState(false)

  const [error, setError] =
    useState("")

  const [isUploading, setIsUploading] =
    useState(false)

  const [isLoadingSamples, setIsLoadingSamples] =
    useState(true)

  const [sampleLoadError, setSampleLoadError] =
    useState("")

  /* =========================================
          LOAD LOT FROM SESSION STORAGE
  ========================================= */

  useEffect(() => {
    const storedLot =
      sessionStorage.getItem(
        "agrisathi-harvest-lot"
      )

    if (!storedLot) return

    try {
      const parsedLot = JSON.parse(storedLot)

      /*
       * Only use session data if it belongs
       * to the current URL lot.
       */

      if (
        !id ||
        !parsedLot.lotId ||
        parsedLot.lotId === id
      ) {
        setLot(parsedLot)
      }
    } catch (err) {
      console.error(
        "Unable to read harvest lot:",
        err
      )
    }
  }, [id])

  /* =========================================
          LOAD EXISTING SAMPLE IMAGES
  ========================================= */

  const loadExistingSamples =
    useCallback(async () => {
      if (!id) {
        setSampleLoadError(
          "Harvest lot ID is missing."
        )

        setIsLoadingSamples(false)

        return
      }

      try {
        setIsLoadingSamples(true)
        setSampleLoadError("")

        const response =
          await api.get(
            `/lots/${id}/samples`
          )

        const existingSamples:
          ApiSampleImage[] =
          response.data.data || []

        const mappedSamples:
          SampleImage[] =
          existingSamples.map(
            (sample) => ({
              id: sample._id,

              file: null,

              preview:
                `${API_BASE_URL}/${sample.filePath.replace(
                  /\\/g,
                  "/"
                )}`,

              persisted: true,
            })
          )

        setImages(mappedSamples)
      } catch (err) {
        console.error(
          "Failed to load sample images:",
          err
        )

        setSampleLoadError(
          "Unable to load previously uploaded samples."
        )
      } finally {
        setIsLoadingSamples(false)
      }
    }, [id])

  /* =========================================
          LOAD SAMPLES WHEN PAGE OPENS
  ========================================= */

  useEffect(() => {
    loadExistingSamples()
  }, [loadExistingSamples])

  /* =========================================
              CAMERA CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          )

        cameraStreamRef.current = null
      }
    }
  }, [])

  /* =========================================
              ADD FILES
  ========================================= */

  const addFiles = (files: File[]) => {
    setError("")

    const validFiles: File[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `${file.name} is larger than 10 MB and was skipped.`
        )

        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      setError(
        "Please select valid image files."
      )

      return
    }

    setImages((currentImages) => {
      const remainingSlots =
        MAX_IMAGES -
        currentImages.length

      if (remainingSlots <= 0) {
        setError(
          `You can upload a maximum of ${MAX_IMAGES} images.`
        )

        return currentImages
      }

      const filesToAdd =
        validFiles.slice(
          0,
          remainingSlots
        )

      if (
        validFiles.length >
        remainingSlots
      ) {
        setError(
          `Only ${remainingSlots} more image${
            remainingSlots === 1
              ? ""
              : "s"
          } can be added.`
        )
      }

      const newImages =
        filesToAdd.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview:
            URL.createObjectURL(file),
          persisted: false,
        }))

      return [
        ...currentImages,
        ...newImages,
      ]
    })
  }

  /* =========================================
            FILE PICKER
  ========================================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files || []
      )

    addFiles(files)

    event.target.value = ""
  }

  /* =========================================
              DRAG OVER
  ========================================= */

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    setIsDragging(true)
  }

  /* =========================================
              DRAG LEAVE
  ========================================= */

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    setIsDragging(false)
  }

  /* =========================================
              DROP
  ========================================= */

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    setIsDragging(false)

    const files =
      Array.from(
        event.dataTransfer.files
      )

    addFiles(files)
  }

  /* =========================================
              REMOVE IMAGE
  ========================================= */

  const removeImage = (
    imageId: string
  ) => {
    setImages((currentImages) => {
      const imageToRemove =
        currentImages.find(
          (image) =>
            image.id === imageId
        )

      /*
       * Only revoke local blob URLs.
       */

      if (
        imageToRemove &&
        !imageToRemove.persisted &&
        imageToRemove.preview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imageToRemove.preview
        )
      }

      return currentImages.filter(
        (image) =>
          image.id !== imageId
      )
    })

    setError("")
  }

  /* =========================================
              START CAMERA
  ========================================= */

  const startCamera =
    async () => {
      setCameraError("")
      setError("")

      if (
        images.length >=
        MAX_IMAGES
      ) {
        setCameraError(
          `You already have the maximum of ${MAX_IMAGES} samples.`
        )

        return
      }

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser. Please use Choose Images instead."
        )

        return
      }

      try {
        if (
          cameraStreamRef.current
        ) {
          cameraStreamRef.current
            .getTracks()
            .forEach((track) =>
              track.stop()
            )

          cameraStreamRef.current =
            null
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: {
                  ideal: "environment",
                },

                width: {
                  ideal: 1280,
                },

                height: {
                  ideal: 720,
                },
              },

              audio: false,
            }
          )

        cameraStreamRef.current =
          stream

        setCameraOpen(true)

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject =
              stream

            videoRef.current
              .play()
              .catch((err) =>
                console.warn(
                  "Video autoplay was blocked:",
                  err
                )
              )
          }
        }, 100)
      } catch (err) {
        console.error(
          "Camera access error:",
          err
        )

        setCameraOpen(false)

        if (
          err instanceof DOMException
        ) {
          if (
            err.name ===
            "NotAllowedError"
          ) {
            setCameraError(
              "Camera permission was denied. Please allow camera access in your browser settings."
            )
          } else if (
            err.name ===
            "NotFoundError"
          ) {
            setCameraError(
              "No camera was found on this device."
            )
          } else if (
            err.name ===
            "NotReadableError"
          ) {
            setCameraError(
              "The camera is already being used by another application."
            )
          } else {
            setCameraError(
              "Unable to access the camera. Please check your browser permissions."
            )
          }
        } else {
          setCameraError(
            "Unable to access the camera. Please try again."
          )
        }
      }
    }

  /* =========================================
              STOP CAMERA
  ========================================= */

  const stopCamera = () => {
    if (
      cameraStreamRef.current
    ) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        )

      cameraStreamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null
    }

    setCameraOpen(false)
    setCameraError("")
  }

  /* =========================================
              CAPTURE PHOTO
  ========================================= */

  const capturePhoto = () => {
    const video =
      videoRef.current

    const canvas =
      canvasRef.current

    if (!video || !canvas) {
      setCameraError(
        "Camera is not ready. Please try again."
      )

      return
    }

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setCameraError(
        "Camera is still starting. Please wait a moment."
      )

      return
    }

    canvas.width =
      video.videoWidth

    canvas.height =
      video.videoHeight

    const context =
      canvas.getContext("2d")

    if (!context) {
      setCameraError(
        "Unable to capture the camera image."
      )

      return
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(
            "Failed to create the captured image."
          )

          return
        }

        const file =
          new File(
            [blob],
            `tomato-sample-${Date.now()}.jpg`,
            {
              type: "image/jpeg",
            }
          )

        const preview =
          URL.createObjectURL(file)

        const newImage:
          SampleImage = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          persisted: false,
        }

        setImages(
          (currentImages) => {
            if (
              currentImages.length >=
              MAX_IMAGES
            ) {
              URL.revokeObjectURL(
                preview
              )

              return currentImages
            }

            return [
              ...currentImages,
              newImage,
            ]
          }
        )

        setCameraError("")
      },
      "image/jpeg",
      0.92
    )
  }

  /* =========================================
              ANALYZE SAMPLES
  ========================================= */

  const handleAnalyze =
    async () => {
      setError("")

      if (!id) {
        setError(
          "Harvest lot ID is missing. Please go back and create the harvest lot again."
        )

        return
      }

      if (
        images.length <
        MIN_IMAGES
      ) {
        setError(
          `Please add at least ${MIN_IMAGES} representative sample images before continuing.`
        )

        return
      }

      const newImages =
        images.filter(
          (image) =>
            !image.persisted &&
            image.file
        )

      try {
        setIsUploading(true)

        /* =====================================
              UPLOAD NEW IMAGES ONLY
        ===================================== */

        if (
          newImages.length > 0
        ) {
          const formData =
            new FormData()

          newImages.forEach(
            (image) => {
              if (image.file) {
                formData.append(
                  "samples",
                  image.file
                )
              }
            }
          )

          /*
           * Do NOT manually set Content-Type.
           *
           * Axios/browser creates the correct
           * multipart boundary automatically.
           */

          const response =
            await api.post(
              `/lots/${id}/samples`,
              formData
            )

          console.log(
            "Samples uploaded successfully:",
            response.data
          )
        }

        /* =====================================
              RELOAD SERVER DATA
        ===================================== */

        await loadExistingSamples()

        /* =====================================
              STOP CAMERA
        ===================================== */

        stopCamera()

        /* =====================================
              GO TO ANALYSIS
        ===================================== */

        navigate(
          `/harvests/${id}/analyzing`
        )
      } catch (err: any) {
        console.error(
          "Sample upload failed:",
          err
        )

        setError(
          err.response?.data?.message ||
            "Unable to upload sample images. Please try again."
        )
      } finally {
        setIsUploading(false)
      }
    }

  /* =========================================
              PROGRESS
  ========================================= */

  const progressPercentage =
    Math.min(
      (images.length /
        MIN_IMAGES) *
        100,
      100
    )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================
                    HEADER
      ===================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Leaf size={19} />
            </div>

            <span className="text-lg font-bold text-slate-900">
              AgriSathi
            </span>

          </Link>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">

            <span className="font-medium text-emerald-600">
              1. Harvest
            </span>

            <span>→</span>

            <span className="font-semibold text-slate-900">
              2. Sample & Analyze
            </span>

            <span>→</span>

            <span>
              3. Recommendation
            </span>

          </div>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Link>

        </div>

      </header>

      {/* =====================================
                    MAIN
      ===================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* =================================
                  MAIN CONTENT
          ================================= */}

          <section>

            <div className="mb-6">

              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span>
                  Step 2 of 3
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sample your harvest
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Take representative photos of your
                tomatoes. AgriSathi will use these
                samples to estimate the quality
                distribution of your entire lot.
              </p>

            </div>

            {/* Sampling explanation */}

            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Info size={18} />
                </div>

                <div>

                  <h2 className="text-sm font-semibold text-emerald-950">
                    Use representative samples
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                    You do not need to photograph
                    every tomato. Spread a
                    representative portion of the
                    lot on a clean surface and
                    capture different samples from
                    different parts of the batch.
                  </p>

                </div>

              </div>

            </div>

            {/* Upload card */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">

                <h2 className="text-base font-semibold text-slate-900">
                  Add sample images
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add between {MIN_IMAGES} and{" "}
                  {MAX_IMAGES} clear images.
                </p>

              </div>

              {/* Drop zone */}

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition sm:p-8 ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                  <Upload size={23} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  Drop your sample images here
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  PNG or JPEG • Maximum 10 MB per image
                </p>

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      inputRef.current?.click()
                    }
                    disabled={
                      images.length >=
                        MAX_IMAGES ||
                      isUploading ||
                      isLoadingSamples
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ImagePlus size={17} />
                    Choose Images
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={
                      images.length >=
                        MAX_IMAGES ||
                      isUploading ||
                      isLoadingSamples
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera size={17} />
                    Use Camera
                  </button>

                </div>

                {cameraError &&
                  !cameraOpen && (
                    <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-red-600">
                      {cameraError}
                    </p>
                  )}

                {error && (
                  <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {sampleLoadError && (
                  <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-amber-700">
                    {sampleLoadError}
                  </p>
                )}

              </div>

              {/* Camera */}

              {cameraOpen && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">

                  <div className="relative aspect-video w-full">

                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                      Live Camera
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
                      {images.length}/
                      {MAX_IMAGES} samples
                    </div>

                  </div>

                  <div className="flex flex-col items-center justify-center gap-3 p-4 sm:flex-row">

                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={
                        images.length >=
                        MAX_IMAGES
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      <Camera size={19} />
                      Capture Photo
                    </button>

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                    >
                      <X size={18} />
                      Close Camera
                    </button>

                  </div>

                  {cameraError && (
                    <div className="px-4 pb-4 text-center text-sm font-medium text-red-300">
                      {cameraError}
                    </div>
                  )}

                </div>
              )}

              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {/* Progress */}

              <div className="mt-6">

                <div className="mb-2 flex items-center justify-between text-xs">

                  <span className="font-medium text-slate-600">
                    Sampling progress
                  </span>

                  <span className="font-semibold text-slate-900">
                    {images.length}/
                    {MIN_IMAGES} minimum
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />

                </div>

              </div>

              {/* Image grid */}

              {isLoadingSamples ? (

                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">

                  <p className="text-sm font-medium text-slate-600">
                    Loading previously uploaded samples...
                  </p>

                </div>

              ) : images.length > 0 ? (

                <div className="mt-7">

                  <div className="mb-4 flex items-center justify-between">

                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Sample images
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Review your images before analysis.
                      </p>

                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {images.length} /
                      {MAX_IMAGES}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                    {images.map(
                      (image, index) => (
                        <div
                          key={image.id}
                          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                        >

                          <img
                            src={image.preview}
                            alt={`Tomato sample ${
                              index + 1
                            }`}
                            className="aspect-square w-full object-cover"
                          />

                          <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white backdrop-blur">
                            {index + 1}
                          </div>

                          {image.persisted && (
                            <div className="absolute bottom-2 left-2 rounded-full bg-emerald-600/90 px-2 py-1 text-[10px] font-semibold text-white">
                              Saved
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                image.id
                              )
                            }
                            disabled={
                              isUploading
                            }
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-100 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label={`Remove sample ${
                              index + 1
                            }`}
                          >
                            <Trash2
                              size={15}
                            />
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>

              ) : null}

              {/* Bottom actions */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <Link
                  to={
                    id
                      ? `/harvests/${id}`
                      : "/harvests"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={17} />
                  Back
                </Link>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={
                    images.length <
                      MIN_IMAGES ||
                    isUploading ||
                    isLoadingSamples ||
                    !id
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {isUploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Uploading Samples...
                    </>
                  ) : (
                    <>
                      Analyze Samples
                      <ArrowRight size={17} />
                    </>
                  )}

                </button>

              </div>

            </div>

          </section>

          {/* =================================
                    SIDEBAR
          ================================= */}

          <aside className="space-y-5 self-start">

            {/* Lot Summary */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                />

                <h2 className="text-sm font-semibold text-slate-900">
                  Lot Summary
                </h2>

              </div>

              {lot ? (

                <div className="space-y-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      Crop
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {lot.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {lot.quantity} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Harvest date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {lot.harvestDate}
                    </p>
                  </div>

                  <div>

                    <p className="text-xs text-slate-500">
                      Location
                    </p>

                    <div className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-slate-900">

                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span>
                        {lot.location}
                      </span>

                    </div>

                  </div>

                  {lot.lotName && (
                    <div>

                      <p className="text-xs text-slate-500">
                        Lot name
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {lot.lotName}
                      </p>

                    </div>
                  )}

                </div>

              ) : (

                <p className="text-sm text-slate-500">
                  Harvest lot information is not available.
                </p>

              )}

            </div>

            {/* Sampling status */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="text-sm font-semibold text-slate-900">
                Sampling status
              </h2>

              <div className="mt-4 space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Images added
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {images.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Minimum required
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {MIN_IMAGES}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Maximum allowed
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {MAX_IMAGES}
                  </span>
                </div>

              </div>

              {images.length >=
              MIN_IMAGES ? (

                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-medium leading-5 text-emerald-800">
                  Great. You have enough representative
                  samples to continue.
                </div>

              ) : (

                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-medium leading-5 text-amber-800">
                  Add{" "}
                  {MIN_IMAGES -
                    images.length}{" "}
                  more sample
                  {MIN_IMAGES -
                    images.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  to continue.
                </div>

              )}

            </div>

            {/* Photo tips */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="text-sm font-semibold text-slate-900">
                Photo tips
              </h2>

              <ul className="mt-4 space-y-3">

                <li className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                  <span className="text-xs leading-5 text-slate-600">
                    Use good natural or evenly distributed
                    lighting.
                  </span>
                </li>

                <li className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                  <span className="text-xs leading-5 text-slate-600">
                    Avoid excessive overlap between tomatoes.
                  </span>
                </li>

                <li className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                  <span className="text-xs leading-5 text-slate-600">
                    Capture samples from different parts of
                    the lot.
                  </span>
                </li>

                <li className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                  <span className="text-xs leading-5 text-slate-600">
                    Keep the camera steady and tomatoes
                    clearly visible.
                  </span>
                </li>

              </ul>

            </div>

          </aside>

        </div>

      </main>

    </div>
  )
}

export default Sampling