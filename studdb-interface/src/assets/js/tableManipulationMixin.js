export default {
  methods: {
    changeSorter(by) {
      // Change what we are sorting by and takes care of the order automatically
      // If we are already sorting by the same value then only change the order, else it will change what value we are sorting by
      if (this.sorter.by === by) {
        if (this.sorter.order === 'asc') {
          this.sorter.order = 'desc';
        } else {
          this.sorter.order = 'asc';
        }
      } else {
        this.sorter.by = by;
        this.sorter.order = 'desc';
      }
    },
     // Will decide which icon to use based on the sorter
     whichIcon(by) {
      if (this.sorter.by === by) {
        return `static/images/icons/${this.sorter.order}.png`;
      }
        return 'static/images/icons/no.png';
    },
  },
};
