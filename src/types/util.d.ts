type ExclusiveKeys<A, B> = Exclude<keyof A, keyof B>;
type ExplicitOverlap<A, B> =
  | (A & Partial<Record<ExclusiveKeys<B, A>, undefined>>)
  | (B & Partial<Record<ExclusiveKeys<A, B>, undefined>>);
