describe('Env test', () => {
  it('should test that env variables are set', () => {
    expect(process.env.DATABASE_URL).not.toEqual(undefined);
  });
});
