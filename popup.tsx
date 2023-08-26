import {
  Button,
  Card,
  Input,
  Link,
  Paper,
  Popover,
  Stack,
  Typography,
  type PopoverProps
} from "@mui/material"
import type {
  PlasmoCSConfig,
  PlasmoGetOverlayAnchor,
  PlasmoWatchOverlayAnchor
} from "plasmo"
import { useEffect, useMemo, useRef, useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <Stack minWidth={240}>
      <Typography variant="h6">
        Welcome to your{" "}
        <Link href="https://www.plasmo.com" target="_blank">
          Plasmo
        </Link>{" "}
        Extension!
      </Typography>
      <Input onChange={(e) => setData(e.target.value)} value={data} />
      <Button href="https://docs.plasmo.com" target="_blank">
        View Docs
      </Button>
    </Stack>
  )
}

export default IndexPopup
