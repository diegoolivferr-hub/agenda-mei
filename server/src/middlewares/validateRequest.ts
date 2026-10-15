import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Atribuir valores validados/sanitizados
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          campo: err.path.slice(1).join('.'),
          mensagem: err.message,
        }));
        res.status(400).json({
          erro: 'Dados de requisição inválidos',
          detalhes: issues,
        });
        return;
      }
      next(error);
    }
  };
};
