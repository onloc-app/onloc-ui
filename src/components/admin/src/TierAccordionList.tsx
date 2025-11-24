import type { Tier } from "@/types/types"
import { Box, Typography } from "@mui/material"
import { useState, type SyntheticEvent } from "react"
import { TierAccordion } from "@/components"

export default function TierAccordionList() {
  const tiers: Tier[] = [
    { id: 0, name: "Basic", max_devices: null },
    { id: 1, name: "Pro", max_devices: 5 },
    { id: 2, name: "Ultimate", max_devices: 10 },
  ]

  const [expanded, setExpanded] = useState<string | boolean>(false)
  const handleExpand =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 24, md: 32 },
          fontWeight: 500,
          mb: 2,
          textAlign: { xs: "left", sm: "center", md: "left" },
        }}
      >
        Tiers
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tiers.map((tier) => {
          return (
            <TierAccordion
              key={tier.id}
              tier={tier}
              expanded={expanded}
              handleExpand={handleExpand}
            />
          )
        })}
      </Box>
    </>
  )
}
