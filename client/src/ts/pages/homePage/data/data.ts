const emptyData = [
  {
    id: 0,
    _id: '',
    hours: 24,
    from: 0,
    to: 1440,
    color: '#afafaf',
    title: 'Free time',
    text: '',
  },
];

const container = 1380;

const client = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  planPosWidth: document.documentElement.clientWidth / 2 - container / 2 + 250,
  planPosHeight: document.documentElement.clientHeight / 2 - 15,
  clockPosWidth: document.documentElement.clientWidth / 2 + container / 2 - 330,
  clockPosHeight: document.documentElement.clientHeight / 2 - 15,
};

export { emptyData, client };
