import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";
import useSound from "use-sound";

export interface MinigameProps {
  difficulty: number;
  timeToFinish: number;
}

interface Minigame {
  minigame: {
    inMinigame: boolean;
    start: () => void;
    pointerAngle: number;
    success: boolean | undefined;
    finished: boolean;
    refreshSuccess: () => void;
  };
  handleMouseUp: () => void;
  handleMouseDown: () => void;
}

export const useMinigame = (props: MinigameProps): Minigame => {
  const { difficulty, timeToFinish } = props;

  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);
  const [timePulling, setTimePulling] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [inMinigame, setInMinigame] = useState(false);
  const [pointerAngle, setPointerAngle] = useState(0);
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>(false);

  const [playSoundPullFish, { stop: stopSoundPullFish }] = useSound(
    "sounds/pull-fish.mp3",
    {
      soundEnabled: !isMouseDown,
      interrupt: true,
      volume: 0.1,
    }
  );
  const [playSoundFishPull, { stop: stopSoundFishPull }] = useSound(
    "sounds/pull-fish-2.mp3",
    {
      soundEnabled: isMouseDown,
      playbackRate: 2,
      interrupt: true,
      volume: 0.1,
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!runTime) return;
      setTime(Date.now() - startTime);
    }, ANIMATION.UPDATE_TIME_MS);
    return () => clearInterval(interval);
  }, [startTime, runTime]);

  useEffect(() => {
    if (runTime) {
      setStartTime(Date.now());
      setTime(0);
    }
  }, [runTime]);

  const start = () => {
    setFinished(false);
    setIsMouseDown(false);
    setTimePulling(0);
    setSuccess(undefined);
    setPointerAngle(0);
    setInMinigame(true);
    setRunTime(true);
    console.log("Started minigame!");
  };

  const stop = (success: boolean) => {
    setRunTime(false);
    setInMinigame(false);
    setFinished(true);
    setSuccess(success);
    stopSoundPullFish();
    stopSoundFishPull();
    console.log("Stopped game:", success ? "success" : "failed");
  };

  const refreshSuccess = () => {
    setSuccess(undefined);
  };

  // Update game state
  useEffect(() => {
    const difficultyCoef = Math.log10(difficulty);

    playSoundPullFish();
    playSoundFishPull();

    const deltaAngle = isMouseDown
      ? -0.4 * difficultyCoef +
        0.15 * difficultyCoef * Math.sin((Math.PI * time) / 1000)
      : 0.4 * difficultyCoef -
        0.075 * difficultyCoef * Math.sin((Math.PI * time) / 1000);

    if (isMouseDown) {
      setTimePulling((timePulling) => timePulling + ANIMATION.UPDATE_TIME_MS);
    }

    setPointerAngle((pointerAngle) => pointerAngle + deltaAngle);

    if (timePulling > timeToFinish) {
      stop(true);
    }

    if (pointerAngle > 90 || pointerAngle < -90) {
      stop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  function handleMouseUp() {
    setIsMouseDown(false);
  }

  function handleMouseDown() {
    setIsMouseDown(true);
  }

  return {
    minigame: {
      inMinigame,
      start,
      pointerAngle,
      success,
      finished,
      refreshSuccess,
    },
    handleMouseUp,
    handleMouseDown,
  };
};
