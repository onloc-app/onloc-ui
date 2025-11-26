import type { ApiError } from "@/api"
import { patchTier } from "@/api/src/tierApi"
import { DeleteTierButton, MaxDevicesField } from "@/components"
import { stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Tier } from "@/types/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { mdiChevronDown, mdiDrag } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type SyntheticEvent } from "react"

interface TierAccordionProps {
  tier: Tier
  expanded: string | boolean
  handleExpand: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  forceCollapse: boolean
}

export default function TierAccordion({
  tier,
  expanded,
  handleExpand,
  forceCollapse,
}: TierAccordionProps) {
  const queryClient = useQueryClient()
  const auth = useAuth()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tier.id })

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  }

  const patchTierMutation = useMutation({
    mutationFn: () => patchTier({ ...tier, max_devices: maxDevices }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [maxDevices, setMaxDevices] = useState<number | null>(tier.max_devices)

  const handleReset = () => {
    setMaxDevices(tier.max_devices)
  }

  const handleSave = () => patchTierMutation.mutate()

  return (
    <Box ref={setNodeRef} sx={sortableStyle} {...attributes}>
      <Accordion
        expanded={forceCollapse ? false : expanded === tier.id.toString()}
        onChange={handleExpand(tier.id.toString())}
        square
        disableGutters
        slotProps={{
          transition: {
            timeout: forceCollapse ? 0 : undefined,
            unmountOnExit: true,
          },
        }}
        sx={{ borderRadius: 4 }}
      >
        <AccordionSummary
          {...listeners}
          expandIcon={<Icon path={mdiChevronDown} size={1} />}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon path={mdiDrag} size={1} color="gray" />
            <Box>{tier.name}</Box>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: stringToHexColor(tier.name),
                borderRadius: "50%",
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: 1 }}>
            <MaxDevicesField value={maxDevices} onChange={setMaxDevices} />
          </Box>
        </AccordionDetails>
        <AccordionActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: 1,
            }}
          >
            <DeleteTierButton tier={tier} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                gap: 1,
              }}
            >
              {tier.max_devices !== maxDevices ? (
                <Button onClick={handleReset}>Reset</Button>
              ) : null}
              <Button
                variant="contained"
                disabled={tier.max_devices === maxDevices}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </AccordionActions>
      </Accordion>
    </Box>
  )
}
