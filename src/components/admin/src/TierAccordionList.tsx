import type { Tier } from "@/types/types"
import { Box, Typography } from "@mui/material"
import { useState, type SyntheticEvent } from "react"
import { CreateTierButton, TierAccordion } from "@/components"
import { useQuery } from "@tanstack/react-query"
import { getTiers } from "@/api/src/tierApi"

export default function TierAccordionList() {
  const { data: tiers = [], isLoading: isTiersLoading } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
  })

  const [expanded, setExpanded] = useState<string | boolean>(false)
  const handleExpand =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  if (isTiersLoading) return <p></p>

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 24, md: 32 },
            fontWeight: 500,
            textAlign: { xs: "left", sm: "center", md: "left" },
          }}
        >
          Tiers
        </Typography>
        <CreateTierButton />
      </Box>
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
