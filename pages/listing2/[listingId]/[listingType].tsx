import { useRouter } from "next/router";
import React from "react";

function Page() {
  const router = useRouter();
  console.log("The query>>>", router.query);
  const { listingId, listingType } = router.query as {
    listingId: string;
    listingType: string;
  };

  console.log("The listingId:>>>", listingId);
  return <div>Page {"" + router.query}</div>;
}

export default Page;
