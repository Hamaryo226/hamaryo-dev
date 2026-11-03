import {
  BatteryCharging,
  Building2,
  CalendarDays,
  CheckCheck,
  Circle,
  Footprints,
  Map,
  Music,
  Route,
  TrainFront,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** 記事 JSON の icon 名から引く。載っていない名前は丸印にする */
const ICONS: Record<string, LucideIcon> = {
  battery: BatteryCharging,
  building: Building2,
  calendar: CalendarDays,
  check: CheckCheck,
  footprints: Footprints,
  map: Map,
  music: Music,
  route: Route,
  train: TrainFront,
};

export function featureIcon(name?: string): LucideIcon {
  if (name === undefined) return Circle;
  // noUncheckedIndexedAccess を入れていないので、引けたかは has で見る
  return Object.hasOwn(ICONS, name) ? ICONS[name] : Circle;
}
