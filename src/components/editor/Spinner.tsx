import * as React from "react"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import { useEffect, useRef, useState } from "react"

export const Spinner: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [buffer, setBuffer] = useState(10)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const progressRef = useRef(() => {})
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0)
        setBuffer(10)
      } else {
        const diff = Math.random() * 10
        const diff2 = Math.random() * 10
        setProgress(progress + diff)
        setBuffer(progress + diff + diff2)
      }
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current()
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
    </Box>
  )
}
