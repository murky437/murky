function isObject(thing: unknown): thing is object {
  return !!thing && typeof thing === 'object';
}

export { isObject };
