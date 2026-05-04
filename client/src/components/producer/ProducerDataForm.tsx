import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const MUNICIPALS = ["Altamira", "Medicilândia", "Uruará", "Placas", "Brasil Novo", "Rurópolis", "Trairão", "Itaituba"]; // Example autocomplete if needed

const formSchema = z.object({
  nome: z.string().min(3, "O nome/razão social deve ter pelo menos 3 caracteres"),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().min(11, "Digite um CPF/CNPJ válido"),
  municipio: z.string().min(2, "O município é obrigatório"),
  estado: z.string().min(2, "Selecione o estado"),
  contatoEmail: z.string().email("Digite um e-mail válido").optional().or(z.literal("")),
  contatoTelefone: z.string().min(10, "Digite um telefone válido com DDD").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ProducerDataFormProps {
  profileType: "individual" | "empresa" | "cooperativa";
  onBack: () => void;
  onSuccess: (producerId: string) => void;
}

export default function ProducerDataForm({ profileType, onBack, onSuccess }: ProducerDataFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      nomeFantasia: "",
      cpfCnpj: "",
      municipio: "",
      estado: "PA",
      contatoEmail: "",
      contatoTelefone: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/producers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          fazendaNome: values.nomeFantasia,
          tipo: profileType,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || "Erro no cadastro");
      }

      const prod = await response.json();
      onSuccess(prod.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-gray-900">Dados pessoais / empresa</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">
          {profileType}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {profileType === "individual"
          ? "Preencha seus dados pessoais."
          : "Preencha os dados da sua empresa/cooperativa."}
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{profileType === "individual" ? "Nome completo" : "Razão social"} *</FormLabel>
                    <FormControl>
                      <Input placeholder="Escreva o nome completo ou Razão Social" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {profileType !== "individual" && (
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="nomeFantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome pelo qual é conhecido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{profileType === "individual" ? "CPF" : "CNPJ"} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={profileType === "individual" ? "000.000.000-00" : "00.000.000/0001-00"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {["PA", "AM", "RO", "MT", "AC", "AP", "TO", "MA", "BA", "ES", "MG"].map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Município *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Altamira, Medicilândia, Uruará" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contatoEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contatoTelefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(93) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm"
            >
              &larr; Voltar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Aguarde...
                </>
              ) : (
                <>
                  Salvar e continuar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
