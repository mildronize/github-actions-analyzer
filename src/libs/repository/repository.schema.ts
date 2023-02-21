import { z } from "zod";

export const githubRepositorySchema = z.object({
  /**
   * Case Insensitve
   */
  repository: z.string(),
  /**
   * Default use default branch,
   * When writing to file, it will transform `/` into `__`
   */
  ref: z.string().optional(),
  token: z.string().optional(),
  /**
   * GitHub Actions paths, using glob pattern
   */
  actionsPaths: z.array(z.string()).optional(),
});

export type GithubRepository = z.infer<typeof githubRepositorySchema>;
