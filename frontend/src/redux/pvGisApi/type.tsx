interface PVGisApiResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}