export type TestCase<I, O> = { i: I; o: O };

export type TestCases<I, O> = TestCase<I, O>[];

export type FunctionTestCase<
  F extends (...args: any) => any = (...args: any) => any
> = TestCase<Parameters<F>, ReturnType<F>>;

export type FunctionTestCases<
  F extends (...args: any) => any = (...args: any) => any
> = FunctionTestCase<F>[];

export interface TestCaseWithFunction<
  F extends (...args: any) => any = (...args: any) => any
> {
  f: F;
  cases: FunctionTestCases<F>;
}

export type Maybe<T> = T | null;

export type InputMaybe<T> = Maybe<T>;

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
