


export function setDefaultValue<T extends Record<string, any>>(config: T, defaultValue: Partial<T>){
  for( const [key , _] of Object.entries(defaultValue)){
    config[key as keyof T] = config[key] ?? defaultValue[key];
  }
  return config;
  // PartialRequired<T, K>
}
