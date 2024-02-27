const waitForMasterRes = async (): Promise<unknown> => {
  return new Promise((resolve) => {
    process.on('message', (data) => {
      resolve(data);
    });
  });
};

export default waitForMasterRes;
