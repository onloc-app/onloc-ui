import { stringToHexColor } from "@/helpers/utils"
import type { Tier } from "@/types/types"
import { mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"
import { Accordion, AccordionSummary, Box, Button } from "@mui/material"
import { useState, type SyntheticEvent } from "react"
import { MaxDevicesField } from "@/components"

interface TierAccordionProps {
  tier: Tier
  expanded: string | boolean
  handleExpand: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
}

export default function TierAccordion({
  tier,
  expanded,
  handleExpand,
}: TierAccordionProps) {
  const [maxDevices, setMaxDevices] = useState<number | null>(tier.max_devices)

  const handleReset = () => {
    setMaxDevices(tier.max_devices)
  }

  const handleSave = () => {
    alert("I saved the data")
  }

  return (
    <Box>
      <Accordion
        expanded={expanded === tier.id.toString()}
        onChange={handleExpand(tier.id.toString())}
        square
        disableGutters
        sx={{ borderRadius: 4 }}
      >
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
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
        <AccordionSummary>
          <Box sx={{ width: 1 }}>
            <MaxDevicesField value={maxDevices} onChange={setMaxDevices} />
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
        </AccordionSummary>
      </Accordion>
    </Box>
  )
}
