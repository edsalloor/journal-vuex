export default () => ({
  isLodaing: true,
  entries: [
    {
      id: new Date().getTime(),
      date: new Date().toDateString(),
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam cum blanditiis sed fuga sit magni, ratione vitae, nam cumque nesciunt, reiciendis ab minus ea ipsam! Deleniti dolor in ipsa accusantium?',
      picture: null
    },
    {
      id: new Date().getTime() + 1000,
      date: new Date().toDateString(),
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam cum blanditiis sed fuga sit magni, ratione vitae, nam cumque nesciunt, reiciendis ab minus ea ipsam! Deleniti dolor in ipsa accusantium?',
      picture: null
    },
    {
      id: new Date().getTime() + 2000,
      date: new Date().toDateString(),
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam cum blanditiis sed fuga sit magni, ratione vitae, nam cumque nesciunt, reiciendis ab minus ea ipsam! Deleniti dolor in ipsa accusantium?',
      picture: null
    }
  ]
});
