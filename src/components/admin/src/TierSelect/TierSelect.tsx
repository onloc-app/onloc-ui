import type { Tier } from "@/types/types"
import { Select } from "@mantine/core"
import { mdiCheck } from "@mdi/js"
import { Icon } from "@mdi/react"
import classes from "./TierSelect.module.css"
import TierIndicator from "../TierIndicator"

interface TierSelectProps {
  currentTier: Tier
  tiers: Tier[]
  onTierChange: (tier: Tier) => void
}

export default function TierSelect({
  currentTier,
  tiers,
  onTierChange,
}: TierSelectProps) {
  const handleChange = (newTierId: string | null) => {
    const tier = tiers.find((tier) => tier.id.toString() === newTierId)
    if (tier) {
      onTierChange(tier)
    }
  }

  const options =
    tiers.map((tier) => ({
      label: tier.name,
      value: tier.id.toString(),
    })) || null

  return (
    <Select
      value={currentTier.id.toString()}
      data={options}
      onChange={handleChange}
      leftSection={<TierIndicator tier={currentTier} />}
      renderOption={({ option, checked }) => {
        const tier = tiers.find((t) => t.id === BigInt(option.value))
        if (!tier) return
        return (
          <div className={classes["render"]}>
            <div className={classes["render__row"]}>
              <TierIndicator tier={tier} />
              {option.label}
            </div>
            {checked && <Icon path={mdiCheck} size={0.75} />}
          </div>
        )
      }}
    />
  )
}
