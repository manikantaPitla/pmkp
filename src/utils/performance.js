class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
  }

  startTimer(name) {
    this.metrics[name] = {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    };
  }

  endTimer(name) {
    if (this.metrics[name]) {
      this.metrics[name].endTime = performance.now();
      this.metrics[name].duration = this.metrics[name].endTime - this.metrics[name].startTime;

      console.log(`Performance: ${name} took ${this.metrics[name].duration.toFixed(2)}ms`);

      this.notifyObservers(name, this.metrics[name]);
    }
  }

  measureRender(componentName, callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Render: ${componentName} took ${duration.toFixed(2)}ms`);
    return result;
  }

  getMemoryUsage() {
    if ("memory" in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  measureNetworkRequest(url, options = {}) {
    const startTime = performance.now();

    return fetch(url, options)
      .then(response => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Network: ${url} took ${duration.toFixed(2)}ms`);
        return response;
      })
      .catch(error => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.error(`Network Error: ${url} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
      });
  }

  addObserver(name, callback) {
    if (!this.observers.has(name)) {
      this.observers.set(name, []);
    }
    this.observers.get(name).push(callback);
  }

  // Remove observer
  removeObserver(name, callback) {
    if (this.observers.has(name)) {
      const callbacks = this.observers.get(name);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify observers
  notifyObservers(name, data) {
    if (this.observers.has(name)) {
      this.observers.get(name).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Observer error for ${name}:`, error);
        }
      });
    }
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {};
  }

  // Get all metrics
  getMetrics() {
    return { ...this.metrics };
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = componentName => {
  const startRender = () => {
    performanceMonitor.startTimer(`${componentName}-render`);
  };

  const endRender = () => {
    performanceMonitor.endTimer(`${componentName}-render`);
  };

  return { startRender, endRender };
};

// Utility function for measuring async operations
export const measurePerformance = name => {
  performanceMonitor.startTimer(name);

  return {
    end: () => {
      performanceMonitor.endTimer(name);
    },
  };
};

// Web Vitals monitoring
export const monitorWebVitals = () => {
  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      console.log("FID:", entry.processingStart - entry.startTime);
    });
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    console.log("CLS:", clsValue);
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  return {
    disconnect: () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    },
  };
};

// Performance decorator for class methods
export const performanceDecorator = (target, propertyKey, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    const startTime = performance.now();
    const result = originalMethod.apply(this, args);
    const endTime = performance.now();

    console.log(`${target.constructor.name}.${propertyKey} took ${(endTime - startTime).toFixed(2)}ms`);

    return result;
  };

  return descriptor;
};

// Performance monitoring for async functions
export const asyncPerformanceMonitor = name => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const startTime = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const endTime = performance.now();
        console.log(`${name || propertyKey} took ${(endTime - startTime).toFixed(2)}ms`);
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error(`${name || propertyKey} failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
        throw error;
      }
    };

    return descriptor;
  };
};
