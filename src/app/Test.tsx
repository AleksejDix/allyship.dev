"use client";

import { useTemplate } from "@/query/useTemplate";
import { Button } from "primereact/button";

export function Test() {
  const { data, refetch } = useTemplate();
  return (
    <div>
      {data?.map((product) => (
        <div key={product}>{product}</div>
      ))}

      <Button onClick={() => refetch()}>Refetch</Button>
    </div>
  );
}
