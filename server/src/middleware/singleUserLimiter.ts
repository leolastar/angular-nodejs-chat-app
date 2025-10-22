const { redis } = require("../config/redis");

const limiter = async (userId: string) => {
  const key = `ratelimit:user:${userId}`;
  const [cnt]: any = await redis
    .multi()
    .incr(key)
    .expire(key, 1)
    .exec()
    .then((res: any) => res?.map((r: any) => r[1]));
  return cnt && cnt <= 5;
};
export default limiter;
