export default {
  methods: {
    // Trims the parent object of unnecessary data
    parseParentToSend(parent) {
      // Copying the parent object
      const parentToSend = JSON.parse(JSON.stringify(parent));

      // Map the parents (the server only cares about the ids)
      parentToSend.children = parentToSend.children.map(element => element.id);

      return parentToSend;
    },
  },
};
