import { FunctionDeclaration } from '../components/general/FunctionDeclaration';
import { VariableStatement } from '../components/general/VariableStatement';
import { Decorator } from '../components/decorator/Decorator';
import { Constructor } from '../components/classDeclaration/members/constructor/Constructor';
import { PropertyDeclaration } from '../components/classDeclaration/members/property/PropertyDeclaration';
import { Method } from '../components/classDeclaration/members/method/Method';
import { ClassDeclaration } from '../components/classDeclaration/ClassDeclaration';
import { TSFile } from '../components/TSFile';
import * as ts from 'typescript';

export function mergeImports(baseFile: TSFile, patchFile: TSFile) {
  let exists: boolean;

  if (baseFile.getImports().length === 0) {
    patchFile.getImports().forEach((patchImportClause) => {
      baseFile.addImport(patchImportClause);
    });
  } else {
    patchFile.getImports().forEach((patchImportClause) => {
      exists = false;
      baseFile.getImports().forEach((importClause) => {
        if (importClause.getModule() === patchImportClause.getModule()) {
          importClause.merge(patchImportClause);
          exists = true;
        }
      });
      if (!exists) {
        baseFile.addImport(patchImportClause);
      }
    });
  }
}

export function mergeExports(baseFile: TSFile, patchFile: TSFile) {
  let exists: boolean;

  if (baseFile.getExports().length === 0) {
    patchFile.getExports().forEach((patchExportClause) => {
      baseFile.addExport(patchExportClause);
    });
  } else {
    patchFile.getExports().forEach((patchExportClause) => {
      exists = false;
      baseFile.getExports().forEach((importClause) => {
        if (importClause.getModule() === patchExportClause.getModule()) {
          importClause.merge(patchExportClause);
          exists = true;
        }
      });
      if (!exists) {
        baseFile.addExport(patchExportClause);
      }
    });
  }
}

export function mergeClass(
  baseClass: ClassDeclaration,
  patchClass: ClassDeclaration,
  patchOverrides: boolean,
) {
  let exists: boolean;

  if (patchOverrides) {
    baseClass.setModifiers(patchClass.getModifiers());
    baseClass.setHeritages(patchClass.getHeritages());
  }

  mergeDecorators(
    baseClass.getDecorators(),
    patchClass.getDecorators(),
    patchOverrides,
  );
  mergeProperties(
    baseClass.getProperties(),
    patchClass.getProperties(),
    patchOverrides,
  );
  mergeConstructor(
    baseClass.getConstructor(),
    patchClass.getConstructor(),
    patchOverrides,
  );
  mergeMethods(baseClass.getMethods(), patchClass.getMethods(), patchOverrides);
}

export function mergeDecorators(
  baseDecorators: Decorator[],
  patchDecorators: Decorator[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchDecorators.forEach((patchDecorator) => {
    exists = false;
    baseDecorators.forEach((decorator) => {
      if (patchDecorator.getIdentifier() === decorator.getIdentifier()) {
        exists = true;
        decorator.merge(patchDecorator, patchOverrides);
      }
    });
    if (!exists) {
      baseDecorators.push(patchDecorator);
    }
  });
}

export function mergeProperties(
  baseProperties: PropertyDeclaration[],
  patchProperties: PropertyDeclaration[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchProperties.forEach((patchProperty) => {
    exists = false;
    baseProperties.forEach((property) => {
      if (patchProperty.getIdentifier() === property.getIdentifier()) {
        exists = true;
        property.merge(patchProperty, patchOverrides);
      }
    });
    if (!exists) {
      baseProperties.push(patchProperty);
    }
  });
}

export function mergeConstructor(
  baseConstructor: Constructor,
  patchConstructor: Constructor,
  patchOverrides: boolean,
) {
  mergeMethod(baseConstructor, patchConstructor, patchOverrides);
}

export function mergeMethods(
  baseMethods: Method[],
  patchMethods: Method[],
  patchOverrides,
) {
  let exists: boolean;

  patchMethods.forEach((patchMethod) => {
    exists = false;
    baseMethods.forEach((method) => {
      if (patchMethod.getIdentifier() === method.getIdentifier()) {
        exists = true;
        mergeMethod(method, patchMethod, patchOverrides);
      }
    });
    if (!exists) {
      baseMethods.push(patchMethod);
    }
  });
}

export function mergeMethod(
  baseMethod: Method,
  patchMethod: Method,
  patchOverrides: boolean,
) {
  baseMethod.merge(patchMethod, patchOverrides);
}

export function mergeVariables(
  baseFile: TSFile,
  patchFile: TSFile,
  patchOverrides: boolean,
) {
  let exists: boolean;
  patchFile.getVariables().forEach((patchVariable) => {
    exists = false;
    baseFile.getVariables().forEach((variable) => {
      if (patchVariable.getIdentifier() === variable.getIdentifier()) {
        exists = true;
        variable.merge(patchVariable, patchOverrides);
      }
    });
    if (!exists) {
      baseFile.addVariable(patchVariable);
    }
  });
}

export function mergeFunctions(
  baseFunctions: FunctionDeclaration[],
  patchFunctions: FunctionDeclaration[],
  patchOverrides,
) {
  let exists: boolean;

  patchFunctions.forEach((patchFunction) => {
    exists = false;
    baseFunctions.forEach((func) => {
      if (patchFunction.getIdentifier() === func.getIdentifier()) {
        exists = true;
        mergeFunction(func, patchFunction, patchOverrides);
      }
    });
    if (!exists) {
      baseFunctions.push(patchFunction);
    }
  });
}

export function mergeFunction(
  baseFunction: FunctionDeclaration,
  patchFunction: FunctionDeclaration,
  patchOverrides: boolean,
) {
  baseFunction.merge(patchFunction, patchOverrides);
}
