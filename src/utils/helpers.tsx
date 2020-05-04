const getRandomNumber = (min: number, max: number): number => {
  const processedMin = Math.ceil(min);
  const processedMax = Math.floor(max);
  return (
    Math.floor(Math.random() * (processedMax - processedMin + 1)) + processedMin
  );
};

export default getRandomNumber;
