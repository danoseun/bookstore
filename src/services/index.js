class BaseService {
    constructor(model) {
      this.model = model
    }
  
    create(resource) {
      return this.model.create(resource)
    }
  
    update(resourceIdentifier, updateParams) {
      return this.show(resourceIdentifier).then(resource => resource.update(updateParams))
    }
  
    index(options = {}) {
      return this.model.findAll(options);
    }

    findAndCountAll(){
        return this.model.findAndCountAll();
    }

    findAndCountAllOptions(options = {}){
      return this.model.findAndCountAll(options)
    }
  
    show(resourceIdentifier) {
      const field = Object.keys(resourceIdentifier)[0]
  
      return this.model.findOne({
        where: {[field]: resourceIdentifier[field]}
      })
    }

    showWithOptions(where){
      return this.model.findOne({
        where
      });
    }
  
    destroy(resourceIdentifier) {
      return this.show(resourceIdentifier).then(resource => resource.destroy())
    }
  }
  
  export default BaseService;