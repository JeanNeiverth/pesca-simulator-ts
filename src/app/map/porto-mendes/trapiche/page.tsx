"use client";
import { Game } from "@/app/Game";
import { portoMendesTrapiche } from "./point";
export default function Page() {
  return <Game fishingPoint={portoMendesTrapiche} />;
}
