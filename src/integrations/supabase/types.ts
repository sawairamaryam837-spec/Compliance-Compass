export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          department: string
          email: string
          id: string
          lastActivity: string
          name: string
          role: string
          status: string
          title: string
        }
        Insert: {
          department: string
          email: string
          id: string
          lastActivity?: string
          name: string
          role?: string
          status?: string
          title?: string
        }
        Update: {
          department?: string
          email?: string
          id?: string
          lastActivity?: string
          name?: string
          role?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          at: string
          department: string
          entity: string
          entityId: string
          id: string
          ip: string
          result: string
          user: string
        }
        Insert: {
          action: string
          at?: string
          department?: string
          entity?: string
          entityId?: string
          id: string
          ip?: string
          result?: string
          user?: string
        }
        Update: {
          action?: string
          at?: string
          department?: string
          entity?: string
          entityId?: string
          id?: string
          ip?: string
          result?: string
          user?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          anonymous: boolean
          assignee: string | null
          category: string
          comments: Json
          createdAt: string
          department: string
          description: string
          id: string
          priority: string
          ref: string
          relatedPeople: string
          reporter: string
          status: string
          timeline: Json
          title: string
          updatedAt: string
        }
        Insert: {
          anonymous?: boolean
          assignee?: string | null
          category?: string
          comments?: Json
          createdAt?: string
          department?: string
          description?: string
          id: string
          priority?: string
          ref: string
          relatedPeople?: string
          reporter?: string
          status?: string
          timeline?: Json
          title: string
          updatedAt?: string
        }
        Update: {
          anonymous?: boolean
          assignee?: string | null
          category?: string
          comments?: Json
          createdAt?: string
          department?: string
          description?: string
          id?: string
          priority?: string
          ref?: string
          relatedPeople?: string
          reporter?: string
          status?: string
          timeline?: Json
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          employees: number
          id: string
          manager: string
          name: string
          region: string
        }
        Insert: {
          employees?: number
          id: string
          manager: string
          name: string
          region?: string
        }
        Update: {
          employees?: number
          id?: string
          manager?: string
          name?: string
          region?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          accessLog: Json
          id: string
          linkedLabel: string
          linkedTo: string
          name: string
          size: string
          type: string
          uploadedAt: string
          uploader: string
        }
        Insert: {
          accessLog?: Json
          id: string
          linkedLabel?: string
          linkedTo?: string
          name: string
          size?: string
          type?: string
          uploadedAt?: string
          uploader?: string
        }
        Update: {
          accessLog?: Json
          id?: string
          linkedLabel?: string
          linkedTo?: string
          name?: string
          size?: string
          type?: string
          uploadedAt?: string
          uploader?: string
        }
        Relationships: []
      }
      investigations: {
        Row: {
          complaintId: string | null
          department: string
          dueAt: string
          findings: string
          id: string
          investigator: string
          openedAt: string
          priority: string
          ref: string
          status: string
          timeline: Json
          title: string
        }
        Insert: {
          complaintId?: string | null
          department?: string
          dueAt?: string
          findings?: string
          id: string
          investigator?: string
          openedAt?: string
          priority?: string
          ref: string
          status?: string
          timeline?: Json
          title: string
        }
        Update: {
          complaintId?: string | null
          department?: string
          dueAt?: string
          findings?: string
          id?: string
          investigator?: string
          openedAt?: string
          priority?: string
          ref?: string
          status?: string
          timeline?: Json
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          at: string
          body: string
          href: string
          id: string
          kind: string
          read: boolean
          title: string
        }
        Insert: {
          at?: string
          body?: string
          href?: string
          id: string
          kind?: string
          read?: boolean
          title: string
        }
        Update: {
          at?: string
          body?: string
          href?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string
          email: string
          id: string
          name: string
          title: string
        }
        Insert: {
          created_at?: string
          department?: string
          email?: string
          id: string
          name?: string
          title?: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          id?: string
          name?: string
          title?: string
        }
        Relationships: []
      }
      risks: {
        Row: {
          department: string
          description: string
          id: string
          impact: number
          likelihood: number
          mitigation: string
          owner: string
          ref: string
          reviewDate: string
          status: string
          timeline: Json
          title: string
        }
        Insert: {
          department?: string
          description?: string
          id: string
          impact?: number
          likelihood?: number
          mitigation?: string
          owner?: string
          ref: string
          reviewDate?: string
          status?: string
          timeline?: Json
          title: string
        }
        Update: {
          department?: string
          description?: string
          id?: string
          impact?: number
          likelihood?: number
          mitigation?: string
          owner?: string
          ref?: string
          reviewDate?: string
          status?: string
          timeline?: Json
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "compliance_officer" | "investigator" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "compliance_officer", "investigator", "employee"],
    },
  },
} as const
