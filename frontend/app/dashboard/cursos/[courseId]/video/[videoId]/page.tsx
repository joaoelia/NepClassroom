"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Maximize, ZoomIn, ZoomOut, Bookmark } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function VideoPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [bookmarks, setBookmarks] = useState<number[]>([])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.volume = value[0]
    setVolume(value[0])
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoom < 2) {
      setZoom(zoom + 0.25)
    } else if (direction === "out" && zoom > 0.5) {
      setZoom(zoom - 0.25)
    }
  }

  const addBookmark = () => {
    if (!bookmarks.includes(currentTime)) {
      setBookmarks([...bookmarks, currentTime].sort((a, b) => a - b))
    }
  }

  const jumpToBookmark = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Voltar ao Curso
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Vídeo {params.videoId} - Aula Exemplo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  style={{ transform: `scale(${zoom})` }}
                  src="/placeholder-video.mp4"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Seu navegador não suporta vídeo HTML5.
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="relative">
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        onValueChange={handleSeek}
                        className="w-full"
                      />
                      {/* Bookmarks */}
                      {bookmarks.map((bookmark, index) => (
                        <div
                          key={index}
                          className="absolute top-0 w-2 h-2 bg-yellow-400 rounded-full cursor-pointer"
                          style={{ left: `${(bookmark / duration) * 100}%` }}
                          onClick={() => jumpToBookmark(bookmark)}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-white" />
                          <Slider
                            value={[volume]}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="w-20"
                          />
                        </div>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={addBookmark}
                          className="text-white hover:bg-white/20"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleZoom("out")}
                          className="text-white hover:bg-white/20"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleZoom("in")}
                          className="text-white hover:bg-white/20"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Playback Speed Controls */}
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm font-medium">Velocidade:</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <Button
                    key={rate}
                    variant={playbackRate === rate ? "default" : "outline"}
                    size="sm"
                    onClick={() => changePlaybackRate(rate)}
                  >
                    {rate}x
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with bookmarks and notes */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marcações</CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma marcação ainda</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => jumpToBookmark(bookmark)}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      {formatTime(bookmark)}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Duração:</strong> {formatTime(duration)}
                </p>
                <p>
                  <strong>Zoom:</strong> {Math.round(zoom * 100)}%
                </p>
                <p>
                  <strong>Velocidade:</strong> {playbackRate}x
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
