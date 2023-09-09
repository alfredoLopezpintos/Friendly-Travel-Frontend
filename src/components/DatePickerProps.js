export const weekdaysShort = locale => {
    const options = { weekday: 'short' }
    return [1, 2, 3, 4, 5, 6, 7].map(i =>
      new Intl.DateTimeFormat(locale, options).format(new Date(Date.UTC(0, 0, i))),
    )
  }
  
  export const weekdaysLong = locale => {
    const options = { weekday: 'long' }
    return [1, 2, 3, 4, 5, 6, 7].map(i =>
      new Intl.DateTimeFormat(locale, options).format(new Date(Date.UTC(0, 0, i))),
    )
  }
  
  export const months = locale => {
    const options = { month: 'long' }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i =>
      new Intl.DateTimeFormat(locale, options).format(new Date(Date.UTC(0, i, 1))),
    )
  }