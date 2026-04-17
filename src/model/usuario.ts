import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nome!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ select: false })
  senha!: string;

  @OneToMany(() => Pedido, (pedido) => pedido.usuario)
  pedidos: Pedido[] = [];
}