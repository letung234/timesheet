export class ValidationService {
  static flattenErrors(errors: any[], parentPath = ''): Record<string, string> {
    const errorList: Record<string, string> = {};

    for (const err of errors) {
      const propertyPath = parentPath
        ? `${parentPath}.${err.property}`
        : err.property;

      if (err.constraints) {
        const firstConstraintKey = Object.keys(err.constraints)[0];
        if (!errorList[propertyPath]) {
          errorList[propertyPath] = err.constraints[firstConstraintKey];
        }
      }

      if (err.children && err.children.length > 0) {
        Object.assign(
          errorList,
          this.flattenErrors(err.children, propertyPath),
        );
      }
    }

    return errorList;
  }
}
