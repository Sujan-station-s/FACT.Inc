const eventEmitter = {
  events: {},
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    const index = this.events[event].push(callback) - 1;
    
    // Return an unsubscribe function
    return () => {
      this.events[event].splice(index, 1);
      // More robustly:
      // this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  },
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event emitter callback for event "${event}":`, error);
        }
      });
    }
  }
};

export default eventEmitter;