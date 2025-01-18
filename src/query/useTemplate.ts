import { useQuery } from "@tanstack/react-query";

async function getProcuts() {
  const products = ["product1", "product2", "product3"];
  console.log(products);

  return products;
}

export const useTemplate = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProcuts(),
  });
};
