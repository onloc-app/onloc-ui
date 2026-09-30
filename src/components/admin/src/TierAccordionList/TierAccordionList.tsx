import { getTiers, reorderTiers, type ApiError } from "@/api"
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
import { Accordion, Skeleton, Title } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { memo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./TierAccordionList.module.css"

function TierAccordionList() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: tiers = [], isLoading: isTiersLoading } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
  })

  const reorderTiersMutation = useMutation({
    mutationFn: (tiers: Tier[]) => reorderTiers(tiers),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tiers"] }),
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [sortableTiers, setSortableTiers] = useState<Tier[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tempTierId, setTempTierId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleExpand = (tierId: string | null) => {
    setExpanded(tierId)
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

  const handleDragStart = () => {
    handleExpand(null)
    setTempTierId(expanded)
    setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    handleExpand(tempTierId)
    setIsDragging(false)

    const { active, over } = event
    if (!over || active.id === over.id) return

    setSortableTiers((currentTiers) => {
      const oldIndex = currentTiers.findIndex(
        (tier) => tier.id.toString() === active.id,
      )
      const newIndex = currentTiers.findIndex(
        (tier) => tier.id.toString() === over.id,
      )
      const newOrder = arrayMove(currentTiers, oldIndex, newIndex)

      const updatedTiers = newOrder.map((tier, index) => ({
        ...tier,
        order_rank: index + 1,
      }))

      reorderTiersMutation.mutate(updatedTiers)

      return updatedTiers
    })
  }

  const tierIds = sortableTiers.map((tier) => tier.id.toString())

  return (
    <div className={classes["container"]}>
      <div className={classes["container__header"]}>
        <Title>{t("components.tier_accordion_list.title")}</Title>
        <CreateTierButton />
      </div>
      <div className={classes["container__content"]}>
        <Accordion
          value={expanded}
          onChange={handleExpand}
          transitionDuration={isDragging ? 0 : undefined}
        >
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
              {!isTiersLoading ? (
                sortableTiers.map((tier) => {
                  return <TierAccordion key={tier.id} tier={tier} />
                })
              ) : (
                <Skeleton height={64} />
              )}
            </SortableContext>
          </DndContext>
        </Accordion>
      </div>
    </div>
  )
}

export default memo(TierAccordionList)
