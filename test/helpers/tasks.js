export const expectNoTasks = async (queue) => {
  const stats = await queue.getJobCounts();

  return expect(Object.keys(stats).every((state) => stats[state] === 0)).toBe(
    true,
  );
};

export const expectCompletedTasks = async (queue, count) => {
  const completed = await queue.getCompletedCount();

  return expect(completed).toBe(count);
};
