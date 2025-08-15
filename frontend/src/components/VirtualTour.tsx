import * as React from "react";
import instance, { BASEURL } from "../utils/axios";
import { useParams } from "react-router";

const VirtualTour = () => {
  const [indexUrl, setIndexUrl] = React.useState<string | null>(null);
  const params = useParams<{ slug: string }>();

  React.useEffect(() => {
    const fetchUrlIndex = async () => {
      const response = await instance.get(
        `/school/schools/${params.slug}/virtual-tour/`
      );
      setIndexUrl(response.data?.index_url);
    };
    fetchUrlIndex();
  }, [params.slug, BASEURL]);

  if (indexUrl) {
    return (
      <iframe
        src={indexUrl}
        style={{ width: "100%", height: "70vh", border: "green" }}
      />
    );
  }
};

export default VirtualTour;
