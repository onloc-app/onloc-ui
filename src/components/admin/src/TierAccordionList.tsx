import type { ApiError } from "@/api"
import { getTiers, reorderTiers } from "@/api/src/tierApi"
import { CreateTierButton, TierAccordion } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Tier } from "@/types/types"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Box, Typography } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState, type SyntheticEvent } from "react"

export default function TierAccordionList() {
  const auth = useAuth()

  const { data: tiers = [], isLoading: isTiersLoading } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
  })

  const reorderTiersMutation = useMutation({
    mutationFn: (tiers: Tier[]) => reorderTiers(tiers),
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [sortableTiers, setSortableTiers] = useState<Tier[]>([])
  const [expanded, setExpanded] = useState<string | boolean>(false)
  const [forceCollapse, setForceCollapse] = useState<boolean>(false)

  const handleExpand =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  useEffect(() => {
    const sortedTiers = [...tiers].sort((a, b) => a.order_rank - b.order_rank)
    setSortableTiers(sortedTiers)
  }, [tiers])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  )

  const handleDragStart = () => setForceCollapse(true)

  const handleDragEnd = (event: DragEndEvent) => {
    setForceCollapse(false)
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSortableTiers((currentTiers) => {
      const oldIndex = currentTiers.findIndex((tier) => tier.id === active.id)
      const newIndex = currentTiers.findIndex((tier) => tier.id === over.id)
      const newOrder = arrayMove(currentTiers, oldIndex, newIndex)

      const updatedTiers = newOrder.map((tier, index) => ({
        ...tier,
        order_rank: index + 1,
      }))

      reorderTiersMutation.mutate(updatedTiers)

      return updatedTiers
    })
  }

  const tierIds = sortableTiers.map((tier) => tier.id)

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tierIds}
            strategy={verticalListSortingStrategy}
          >
            {sortableTiers.map((tier) => {
              return (
                <TierAccordion
                  key={tier.id}
                  tier={tier}
                  expanded={expanded}
                  handleExpand={handleExpand}
                  forceCollapse={forceCollapse}
                />
              )
            })}
          </SortableContext>
        </DndContext>
      </Box>
    </>
  )
}
