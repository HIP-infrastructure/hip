export const uniq = (type: string = 'server') => {
    const uniqid = `${type === 'server' ? 'session' : 'app'}-${Date.now()
      .toString()
      .slice(-3)}`
  
    return uniqid
  }