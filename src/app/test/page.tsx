"use client";

import { useEffect, useState } from "react";

export default function Test() {
  const [status, setStatus] = useState(1);

  useEffect(() => {
    console.log(status);
  }, [status]);

  return <button onClick={() => setStatus(2)}>test</button>;
}
